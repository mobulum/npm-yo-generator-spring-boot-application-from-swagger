package <%=packageName%>

import groovy.json.JsonOutput
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import spock.lang.Specification
import spock.lang.Unroll

import java.util.Collections;

<% imports && imports.forEach(function (importClassName, i) { %>import <%=modelPackageName %>.<%=importClassName %>
<% }) %>

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@SpringBootTest
public class <%=classname%>Spec extends Specification {

    def underTest = new <%=classname%>()

    def mockMvc = MockMvcBuilders.standaloneSetup(underTest).build()

    <%routes.forEach(function (route, i)  {%>
      <%route.operations.forEach(function (operation, i)
        {%>
    <% if (operation.produces) { %>@Unroll<% } %>
    def 'should return valid response from <%=operation.method%> <%=basePath%><%=operation.path%><% if (operation.produces) { %> with accepting: #produces<% } %>'() {
        when:
        def response = mockMvc.perform(
                MockMvcRequestBuilders
                        .<% if (operation.fileUploadField) { %>fileUpload<% } else { %><%=methodName(operation.method)%><% } %>('<%=basePath%><% if (operation.pathForTest) {%><%=operation.pathForTest%><%} else {%><%=operation.path%><%}%>')
                        <%operation.parameters && operation.parameters.forEach(function (param, i){%><%if (param.in === 'header') { %>.header('<%=param.name%>', 'val')<% } %><%if (param.in === 'body') { %>.content(JsonOutput.toJson(<% if (param.paramContainer) { %>Collections.singletonList(<% } %><% if (['Integer', 'String', 'Long', 'Boolean', 'Float', 'Decimal'].indexOf(param.paramClass) === -1) { %><%=param.paramClass%>.<%=param.paramClass%>Builder.a<%=param.paramClass%>().build())<% } else { %><%=param.paramClass%>.valueOf("1")<% } %><% if (param.paramContainer) { %>)<% } %>)<% } %><%if (param.in === 'query' || param.in === 'formData') { %><% if (param.type === 'file') { %>.file('<%=param.name%>', 'content'.getBytes())<% } else { %>.param('<%=param.name%>', '<%=param.default%>')<% } %><% } %>
                            <%})%>
                        <%if (operation.consumesString) { %>.contentType('<%- operation.consumesString%>')<%}%>
                        <% if (operation.produces) { %>.accept(produces)<% } %>
        )

        then:
        response.andExpect(status().is(<%-operation.successStatus%>.value()))
                <%if (operation.returnType !== 'void') { %>.andExpect(content().contentTypeCompatibleWith(produces))<% } %>

        <% if (operation.produces) { %>
        where:
        produces << ['<%- operation.produces.join("', '")%>']<% } %>
    }
    <%})%>
  <%});%>
}
